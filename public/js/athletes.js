async function loadAthletes() {
  const data = await apiRequest("/athletes");

  const table = document.querySelector("#athlete-table tbody");
  table.innerHTML = "";

  data.forEach(a => {
    table.innerHTML += `
      <tr>
        <td>${a.name}</td>
        <td>${a.age}</td>
        <td>${a.weight}</td>
        <td>${a.category}</td>
      </tr>
    `;
  });
}