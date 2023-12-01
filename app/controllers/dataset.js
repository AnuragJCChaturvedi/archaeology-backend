const models = require('archaeology-models');
const { Op } = require('sequelize');

const { errCodeWithMsg } = require('../helpers/common');
const { formatCase } = require('../helpers/dataset');

class DatasetCtrl {
  async getAllDataset() {
    let surveys = await models.survey.findAll({
      include: [
        {
          model: models.user,
          as: 'createdByUser',
        },
        {
          model: models.user,
          as: 'updatedByUser',
        },
      ],
      where: { isActive: true },
      attributes: ['id', 'name', 'createdAt', 'updatedAt'],
    }); // TODO: add pagination

    if (surveys) {
      surveys = surveys.map((survey) => {
        return {
          id: survey.id,
          name: survey.name,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
          createdByUser: survey.createdByUser.name,
          updatedByUser: survey.updatedByUser.name,
        };
      });
    }

    return surveys;
  }

  async getDatasetById({ id }) {
    const survey = await models.survey.findOne({
      include: [
        {
          model: models.user,
          as: 'createdByUser',
        },
        {
          model: models.user,
          as: 'updatedByUser',
        },
      ],
      where: { id },
    });
    if (!survey)
      errCodeWithMsg({ code: 200, msg: "Request Dataset doesn't exist" });

    const surveyMetaData = await models.surveyMetaData.findAll({
      include: [
        {
          model: models.user,
          as: 'createdByUser',
        },
        {
          model: models.user,
          as: 'supervisedByUser',
        },
      ],
      where: {
        createdAt: {
          [Op.gt]: survey.dataValues.updatedAt,
        },
        surveyId: id,
      },
    });

    const cases = await models.case.findAll({
      include: [
        {
          model: models.caseMetaData,
          include: [
            {
              model: models.user,
              as: 'createdByUser',
            },
            {
              model: models.user,
              as: 'supervisedByUser',
            },
          ],
          where: {
            createdAt: {
              [Op.gt]: models.sequelize.literal('"case"."updatedAt"'),
            },
          },
        },
        {
          model: models.user,
          as: 'createdByUser',
        },
        {
          model: models.user,
          as: 'supervisedByUser',
        },
      ],
      where: {
        surveyId: id,
      },
    });

    return await datasetHelper.formatCase({ survey, surveyMetaData, cases });
  }
}

module.exports = new DatasetCtrl();
