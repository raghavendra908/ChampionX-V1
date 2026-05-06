async function createChampionship() {
  const title = document.getElementById("title").value;

  const res = await apiRequest("/championships", "POST", { title });

  alert("Created successfully");
}