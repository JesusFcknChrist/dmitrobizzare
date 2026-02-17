// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyAdqZNPQyjkEm4tJvHt_PFu3X0bfZqBSG4",
  authDomain: "bizzare-comments.firebaseapp.com",
  databaseURL: "https://bizzare-comments-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bizzare-comments",
  storageBucket: "bizzare-comments.firebasestorage.app",
  messagingSenderId: "618476286042",
  appId: "1:618476286042:web:a0e7e5c522a8b3f2202863",
  measurementId: "G-FE2NKLFE5N"
};

// ===== Init Firebase =====
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== Comment System =====
function setupComments(chapterId) {
  const container = document.querySelector(`.comments[data-chapter="${chapterId}"]`);
  if(!container) return;

  const listEl = container.querySelector(".comment-list");
  const nameInput = container.querySelector("input");
  const textInput = container.querySelector("textarea");
  const btn = container.querySelector("button");

  // Post comment
  btn.addEventListener("click", () => {
    const name = nameInput.value || "Anonymous";
    const text = textInput.value.trim();
    if(!text) return alert("Write something!");

    db.ref("comments/" + chapterId).push({
      name,
      text,
      timestamp: Date.now()
    });

    textInput.value = "";
  });

  // Load comments live
  const ref = db.ref("comments/" + chapterId);
  ref.on("value", snapshot => {
    listEl.innerHTML = "";
    const comments = snapshot.val();
    if(comments){
      Object.values(comments).forEach(c => {
        const div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `<strong>${c.name}:</strong> ${c.text}`;
        listEl.appendChild(div);
      });
    }
  });
}

// ===== Auto-setup all chapters on page =====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".comments[data-chapter]").forEach(el => {
    const chapterId = el.getAttribute("data-chapter");
    setupComments(chapterId);
  });
});