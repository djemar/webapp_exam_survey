import SurveyCard from "./SurveyCard";

function SurveyList(props) {
  const { surveys } = props;
  return (
    <>
      <h3 id='title-main' className='my-4 text-center text-uppercase'>
        Available surveys
      </h3>
      {surveys.map((s) => (
        <SurveyCard key={s.surveyId} survey={s} />
      ))}
    </>
  );
}

export default SurveyList;
