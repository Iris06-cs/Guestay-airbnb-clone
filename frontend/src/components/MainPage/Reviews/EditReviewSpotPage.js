// import multipleGenerator from "../../../utils/multipleGenerator";
// const EditReviewSpotPage = ({ userId, stars, review, user }) => {
//   return (
//     <>
//       <form>
//         {multipleGenerator(Number(stars)).map((num) => (
//           <span key={num} style={{ display: "inline" }}>
//             <label>
//               <span style={{ color: "black", backgroundColor: "white" }}>
//                 <i className="fa-solid fa-star"></i>
//               </span>
//             </label>
//             <input style={{ WebkitAppearance: "none" }} type="radio"></input>
//           </span>
//         ))}
//         <textarea value={review} />
//         {user && user.id === userId && <button>Edit</button>}
//       </form>
//     </>
//   );
// };
// export default EditReviewSpotPage;
