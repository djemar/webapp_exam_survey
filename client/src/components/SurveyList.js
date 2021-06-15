import SurveyCard from "./SurveyCard";
const cards = [1, 2, 3, 4, 5];

function SurveyList(props) {
  return (
    <>
      <h3 id='title-main' className='my-4 text-center text-uppercase'>
        Available surveys
      </h3>
      {cards.map((n) => (
        <SurveyCard key={n.toString()} />
      ))}
    </>
  );
}

export default SurveyList;
