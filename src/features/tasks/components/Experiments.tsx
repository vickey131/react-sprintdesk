import { useState, useEffect } from "react";

// export default function StateSnapshot() {
//   const [count, setCount] = useState(0);

//   function handleClick() {
//     console.log("before", count);

//     setCount(count + 1);

//     console.log("after", count);
//   }

//   return (
//     <div>
//       <p>State Snapshot</p>
//       <p>{count}</p>
//       <button onClick={handleClick}>Increase</button>
//     </div>
//   );
// }

// export default  function Batching() {
//   const [count, setCount] = useState(0);

//   function handleClick() {
//     setCount((prev) => prev + 1);
//     setCount((prev) => prev + 1);
//     setCount((prev) => prev + 1);
//   }

//   return (
//     <div>
//       <p>Batching</p>
//       <p>Count: {count}</p>
//       <button onClick={handleClick}>Increase by 3</button>
//     </div>
//   );
// }



// function UserForm({ userId }: { userId: number }) {
//   const [name, setName] = useState("");

//   useEffect(() => {
//     console.log(`[UserForm] Mounted for user ${userId}`);

//     return () => {
//       console.log(`[UserForm] Unmounted for user ${userId}`);
//     };
//   }, [userId]);

//   return (
//     <div>
//       <p>User ID: {userId}</p>

//       <label>
//         Name:
//         <input
//           placeholder="Enter a name"
//           value={name}
//           onChange={(event) => setName(event.target.value)}
//         />
//       </label>
//     </div>
//   );
// }

// function KeyResetExperiment() {
//   const [userId, setUserId] = useState(1);

//   return (
//     <section>
//       <p>Key Reset and Component Identity</p>

//       <UserForm key={userId} userId={userId} />

//       <button onClick={() => setUserId((id) => id + 1)}>
//         Switch
//       </button>
//     </section>
//   );
// }

// export default function ComponentIdentity() {
//   const [userId, setUserId] = useState(1);

//   return (
//     <section>
//       <p>Identity by Position</p>

//       <UserForm userId={userId} />

//       <button onClick={() => setUserId((id) => id + 1)}>
//         Switch
//       </button>
//     </section>
//   );
// }

export default function StrictModeExperiment() {
  const [count, setCount] = useState(0);

  console.log("Strict Mode Render:", count);

  useEffect(() => {
    console.log("Strict Mode Effect setup");

    return () => {
      console.log("Strict Mode Effect cleanup");
    };
  }, []);

  return (
    <section>
      <h2>Strict Mode</h2>
      <p>Count: {count}</p>
      <button onClick={() => setCount((value) => value + 1)}>
        Increase
      </button>
    </section>
  );
}