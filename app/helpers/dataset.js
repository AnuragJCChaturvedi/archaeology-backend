const getSurveys = async ({ survey, surveyMetaData }) => {
  let resultantColumns = survey.dataValues.schema;

  surveyMetaData.forEach((surveyMeta) => {
    const changedSurvey = surveyMeta.dataValues;
  });

  return {
    id: survey.id,
    name: survey.dataValues.name,
    data: survey.dataValues.schema,
    createdByUser: survey.dataValues.createdByUser.name,
    // changes
  };
};

const formatCase = async ({ survey, surveyMetaData, cases }) => {
  const surveyObj = await getSurveys({ survey, surveyMetaData });
};

module.exports = {
  formatCase,
};
