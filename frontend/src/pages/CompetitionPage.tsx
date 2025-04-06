import ContainerFilter from "../components/ContainerFilter";
import CompetitionList from "../components/CompetitionList";
import Header from "../components/Header";
import { useState } from "react";
import CartSummary from "../components/CartSummary";
import AuthorizeView, { AuthorizedUser } from "../components/AuthorizeView";
import Logout from "../components/Logout";

function CompetitionPage() {
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <div className="Container mt-4">
        <CartSummary />
        <Header />
        <div className="row">
          <div className="col-md-3">
            <ContainerFilter
              selectedContainers={selectedContainers}
              setSelectedContainers={setSelectedContainers}
            />
          </div>
          <div className="col-md-9">
            <CompetitionList selectedContainers={selectedContainers} />
          </div>
        </div>
      </div>
    </AuthorizeView>
  );
}
export default CompetitionPage;
