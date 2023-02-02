const CreateSpotForm = ({ setIsClicked }) => {
  return (
    <form>
      {/* back to create spot home */}
      <button onClick={(e) => setIsClicked(false)}>back</button>
    </form>
  );
};
export default CreateSpotForm;
