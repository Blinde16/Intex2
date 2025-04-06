import { useEffect, useState } from "react";
import { Rootbeer } from "../types/Rootbeer";
import { useNavigate } from "react-router-dom";

function CompetitionList({
  selectedContainers,
}: {
  selectedContainers: string[];
}) {
  const [competition, setCompetition] = useState<Rootbeer[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetition = async () => {
      const containerParams = selectedContainers
        .map((cont) => `containers=${encodeURIComponent(cont)}`)
        .join("&");

      const response = await fetch(
        `https://localhost:5000/Competition/GetRootbeers?pageSize=${pageSize}&pageNum=${pageNum}${selectedContainers.length ? `&${containerParams}` : ""}`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setCompetition(data.brews);
      setTotalItems(data.totalNumProjects);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };
    fetchCompetition();
  }, [pageSize, pageNum, totalItems, selectedContainers]);

  return (
    <>
      {competition.map((rootbeer) => (
        <div id="rootbeerCard" className="card" key={rootbeer.rootbeerID}>
          <h2 className="card-title">{rootbeer.rootbeerName}</h2>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>First brewed:</strong> {rootbeer.firstBrewedYear}
              </li>
              <li className="list-group-item">
                <strong>Brewery:</strong> {rootbeer.breweryName}
              </li>
              <li className="list-group-item">
                <strong>Location:</strong> {rootbeer.city}, {rootbeer.state},{" "}
                {rootbeer.country}
              </li>
              <li className="list-group-item">
                <strong>Description:</strong> {rootbeer.description}
              </li>
              <li className="list-group-item">
                <strong>Wholesale cost:</strong> $
                {rootbeer.wholesaleCost.toFixed(2)}
              </li>
              <li className="list-group-item">
                <strong>Retail price:</strong> $
                {rootbeer.currentRetailPrice.toFixed(2)}
              </li>
              <li className="list-group-item">
                <strong>Available in: </strong>
                {rootbeer.container}
              </li>
            </ul>

            <button
              className="btn btn-secondary"
              onClick={() =>
                navigate(
                  `/product/${rootbeer.rootbeerName}/${rootbeer.rootbeerID}/${rootbeer.currentRetailPrice}`
                )
              }
            >
              Buy Now!
            </button>
          </div>
        </div>
      ))}

      <button disabled={pageNum === 1} onClick={() => setPageNum(pageNum - 1)}>
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button key={i} onClick={() => setPageNum(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button
        disabled={pageNum === totalPages}
        onClick={() => setPageNum(pageNum + 1)}
      >
        Next
      </button>

      <br />
      <label>
        Results per page:
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </label>
    </>
  );
}

export default CompetitionList;
