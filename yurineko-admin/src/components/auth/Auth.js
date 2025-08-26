import useAuth from "hooks/useAuth";
import { useRouter } from "next/router";
import React from "react";
import { connect } from "react-redux";

function Auth({ auth, children }) {
  if (typeof window !== "undefined") {
    const route = useRouter();
    if (auth && auth.token) {
      return <>{children}</>;
    } else {
      route.replace("/");
      // return null
      return <div>...loading</div>;
    }
  } else return null;
}

const mapStateToProps = (state) => ({
  auth: state.admin.auth,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
