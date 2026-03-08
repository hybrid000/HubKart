import { Helmet } from "react-helmet-async";

const PageWrapper = ({ title, children }) => {
  return (
    <>
      <Helmet>
        <title>{title} | HubKart</title>
      </Helmet>

      {children}
    </>
  );
};

export default PageWrapper;
