import CallToActions from "@/components/common/CallToActions";
import DefaultFooter from "@/components/footer/default";
import LoginForm from "@/components/common/LoginForm";

import MetaComponent from "@/components/common/MetaComponent";
import Header1 from "@/components/header/header-1";
import { Link } from "react-router-dom";

const metadata = {
  title: "Login | Pets24x7 - Your One-Stop Pet Shop Directory.",
  description: "Pets24x7 - Your One-Stop Pet Shop Directory.",
};

const LogIn = ({ role }) => {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header1 staticHeader={true} />
      {/* End Header 1 */}

      <section className="layout-pt-lg layout-pb-lg bg-blue-2">
        <div className="container">
          <div className="row justify-center">
            <div className="col-xl-6 col-lg-7 col-md-9">
              <div className="px-50 py-50 sm:px-20 sm:py-20 bg-white shadow-4 rounded-4">
                <LoginForm role={role} />
                {/* End .Login */}

                <div className="row y-gap-20 pt-10">
                  <div className="col-12">
                    <Link to="/business-login" className="justify-center d-flex -white h-50 underline">
                      Business Login</Link>
                    <Link to="/admin-login" className="justify-center d-flex -white h-50 underline">
                      Admin Login</Link>
                  </div>
                  <div className="col-12">
                    <div className="text-center px-10">
                      By creating an account, you agree to our Terms of Service
                      and Privacy Statement.
                    </div>
                  </div>
                </div>
                {/* End .row */}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* End login section */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
      {/* End Call To Actions Section */}
    </>
  );
};

export default LogIn;
