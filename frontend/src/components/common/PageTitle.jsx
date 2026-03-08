import { Helmet } from "react-helmet-async";

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <title>{title} | HubKart</title>
    </Helmet>
  );
};

export default PageTitle;
