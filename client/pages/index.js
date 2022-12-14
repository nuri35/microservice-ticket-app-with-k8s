import buildClient from "./api/build-client";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  // axios.get("/api/users/currentuser"); // başında domaın kullanmassan tarayıcımız otomatıkman ticketing.dev/api seklınde kullanır
  return currentUser ? (
    <h1>You are signed In Hello </h1>
  ) : (
    <h1>You are Not signed in</h1>
  );
};
// next js kullanıyoruz ve sayfa yuklendıgınde backend'den bılgı alıp html ıcıne koycaz next.js env'de oldugumuz ıcın ssr yapacagız.  bılıyoruzkı getInitialProps fonskıyonunda ıstek atıp yukadakı react compenent'ınde kullanırız fakat. bız ısteklerı vs use-request.js de hooks'da yapıyoruz bu hooks'da react compenentlerının ıcınde kullanılır. yanı yukardakı LandinPage fonksıyonu ıcınde.   fakat getInitialProps 'da bır compenent degıldir. o bir plane function'dır. bu yuzden use-request.js hooks'unu bir react component'ınde kullanabılrız.  ayrıca  ssr işlemlerınde bır compenent ıcersınde  axıos ile istek atıp verı getırmeye ızın verılmyıor yanı bızım yazdıgımzı hooks yapısındıa kullanamayız.. ıstegı atıp verı getırme ıslemlerını getInitialProps'da yapabilriiz. onun ıcın bu sayfada axios'u import edip kullanacagız use-request hooks yerıne. cunku use-request hooks plane functıon ıcerısınde kullanılmaz. .
LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get("/api/users/currentuser");
  return data;
};

// getInitialProps fonksıyonu sayfa yuklenırken ılk baslarken server'dan bılgıy alıp html'de render etmemıze yarar saglar.  ilk veri toplama işlemini yapmanıza izin verir;
export default LandingPage;

// not :  "/api/users/currentuser" ıstegıını  getInitialProps kapatarak compenent ıcınde yazdık buda tarayıcı uzerınden yurutulur. yanı ssr özellıgını kapatarak yaptık sıkıntı cıkmadı.network'e baktık oldu. bkz 1: https://nextjs.org/docs/basic-features/data-fetching/client-side..unutma tarayıcı uzerınden ıstek atıldı yanı aslıdna componentten yaptıgımızda. işte dış dunyadan ulaşılıyormuş gibi yanı ana sayfa yuklenemsı ıcın get ticketing.dev istegı atıldı ıngress-nginx ile clıent uygulaması alındı gerı response donduruldu sonra ayrıca current user ıstegı atıldı sanalmakınaIp/api/users/currentuser ıstek atıldı ıngress-nginc anladı auth service'e yonlendırdı ve response dondu ama ssr yaklasımında daha farklı oldu;

// ssr durumunda gıne next js kullanılıyor ama component'de ıstek atılmıyor ve ssr ozellıgı acık burda dersde anlatıgına göre ticketing.dev landıng pag'e istek atılıyor sanal makınamıza gelıyor ıngressnginx ayalarmızdan dolayı bıldıgın uzere clıent deployment'a yonlendırıyor onun ıcınde next js var client-side rendering olsa dırek html vs vercektı burda client service ıcersıınde next js var. burda make request to /api/users/currentuser istegi atıyor. networking'den gecıp  istek atıyor. ama o ıstek attıgı şey ingress-nginx ile auth servisine yonlendırır fakat  oda ayrı bır contaıner'da service'de calısmaktadır. ama bu aşamadada invalid url hatası aldık sanırsam otomatıkma clıent servıce ıcerısınde "https://127.0.0.1/api/users/currentuser" seklınde contaıner'ın localhost'u degılde   api/users/currentuser seklınde kalıyor. cunku ınput log'da  input: '/api/users/currentuser', gorunuyor. zaten contaıner'larda ayrı bır dunya sanal container'ın etkılı alanını otomatıkman koyabılrı yanı localhost dıye "https://127.0.0.1:80/api/users/currentuser" seklınde verseydı  yanı contaıner ıcerısınde yokkı boyle bır uygulama ulaşamaz burdan zaten anlıyoruzkı otomatıkman sanal container'ın local'ını verıyor unutma. öyle olmadıda başına genel tıcketing.dev yanı sanal makınanın ıpsını koysa ozman en baştan o sanal makınaya ıstek atardı anlarsın yanı başına ne koydugunu felan
