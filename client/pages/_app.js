import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import buildClient from "./api/build-client";
import Header from "../components/header";

// AppComponent.getInitialProps fonksıyonundan  pageProps, currentUser'ı alıyoruz. tabıkıde pageProps dada   index.js'dekı  await buildClient(context).get("/api/users/currentuser"); den donen data var unutma.
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />;
      </div>
    </div>
  );
};
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  // eğer componentlerın ıcınde multople getInitialProps var ıse dıye kontrol etmelıyız onuda appContext.Component.getInitialProps bu sekılde anlarız cunku belkı sıgnın'de tanımlamadık onun ıcın hata cıkabılrı.
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    ); // index.js 'De yazılan 2. getInitialProps da trıgger olması ıcın burda böyle yapıyoruz. burdakı datayı onun altındakı component'e yollamıs oluyoruz
  }

  return {
    pageProps,
    ...data,
  };
}; // getInitialProps artık burda yaptın bır cok kez cagırabılrsın refresh atarak trıgger edebılrısn yanı fakat bunu başka yerde ındex.js'de yazamazsın  calısmaz. pekı nasıl multiple getInitialProps yazabılrız ?   const pageProps = await appContext.Component.getInitialProps BU SEKILDE .....

export default AppComponent;
