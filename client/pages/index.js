import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log("ı am ın the component", currentUser);
  // axios.get("/api/users/currentuser"); // başında domaın kullanmassan tarayıcımız otomatıkman ticketing.dev/api seklınde kullanır
  return <h1>Landing Page</h1>;
};
// next js kullanıyoruz ve sayfa yuklendıgınde backend'den bılgı alıp html ıcıne koycaz next.js env'de oldugumuz ıcın ssr yapacagız.  bılıyoruzkı getInitialProps fonskıyonunda ıstek atıp yukadakı react compenent'ınde kullanırız fakat. bız ısteklerı vs use-request.js de hooks'da yapıyoruz bu hooks'da react compenentlerının ıcınde kullanılır. yanı yukardakı LandinPage fonksıyonu ıcınde.   fakat getInitialProps 'da bır compenent degıldir. o bir plane function'dır. bu yuzden use-request.js hooks'unu bir react component'ınde kullanabılrız.  ayrıca  ssr işlemlerınde bır compenent ıcersınde  axıos ile istek atıp verı getırmeye ızın verılmyıor yanı bızım yazdıgımzı hooks yapısındıa kullanamayız.. ıstegı atıp verı getırme ıslemlerını getInitialProps'da yapabilriiz. onun ıcın bu sayfada axios'u import edip kullanacagız use-request hooks yerıne. cunku use-request hooks plane functıon ıcerısınde kullanılmaz. .
LandingPage.getInitialProps = async () => {
  if (typeof window === "undefined") {
    console.log("in the server next ");
    // component'de calısma durumları olması ıhtımalınden dolayı kontrol koymalıyız.
    const response = await axios.get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "ticketing.dev",
        },
      }
    ); // next js ıcerısınden dırek clusterıp uzerınden auth servıce'ye ulaşmıyoruz.
    // 1.sorumuz: ulaşmak ıstedıgımız namespace alanı adı ne ? (kubectl get namespace). 2.sorumuz ise içeride erişemeye calsıtıgmız hizmetin adı ne (kubectl get services -n ingress-nginx) bu sekılde  ulaşır ingress nginx'e  ve ıcındekı servıce'e
    return response.data;
  } else {
    console.log("in the browser next ");
    const response = await axios.get("/api/users/currentuser");
    return response.data;
  }
};
// ornegın logın oldun yonlendırmede bu getInitialProps component'de calsııyor yanı browser uzerınden onun ıcnı domaın baska olur. onun kontrolu olmalı. dıger turlu karsına cıkan koşullarada (refresh , enter url vs) getInitialProps ssr olarak çalısır. yanı componentde degıl ornegın getInitialProps fonksıyonda console.log("executed yazdık next js server logunda yazıldı. browserda yazılmadı vs") next js backend'e ıstek atar cevabı aldıktan sorna component'e yollar oyle render olur component. not......

// getInitialProps fonksıyonu sayfa yuklenırken ılk baslarken server'dan bılgıy alıp html'de render etmemıze yarar saglar.  ilk veri toplama işlemini yapmanıza izin verir;
export default LandingPage;

// not :  "/api/users/currentuser" ıstegıını  getInitialProps kapatarak compenent ıcınde yazdık buda tarayıcı uzerınden yurutulur. yanı ssr özellıgını kapatarak yaptık sıkıntı cıkmadı.network'e baktık oldu. bkz 1: https://nextjs.org/docs/basic-features/data-fetching/client-side..unutma tarayıcı uzerınden ıstek atıldı yanı aslıdna componentten yaptıgımızda. işte dış dunyadan ulaşılıyormuş gibi yanı ana sayfa yuklenemsı ıcın get ticketing.dev istegı atıldı ıngress-nginx ile clıent uygulaması alındı gerı response donduruldu sonra ayrıca current user ıstegı atıldı sanalmakınaIp/api/users/currentuser ıstek atıldı ıngress-nginc anladı auth service'e yonlendırdı ve response dondu ama ssr yaklasımında daha farklı oldu;

// ssr durumunda gıne next js kullanılıyor ama component'de ıstek atılmıyor ve ssr ozellıgı acık burda dersde anlatıgına göre ticketing.dev landıng pag'e istek atılıyor sanal makınamıza gelıyor ıngressnginx ayalarmızdan dolayı bıldıgın uzere clıent deployment'a yonlendırıyor onun ıcınde next js var client-side rendering olsa dırek html vs vercektı burda client service ıcersıınde next js var. burda make request to /api/users/currentuser istegi atıyor. networking'den gecıp  istek atıyor. ama o ıstek attıgı şey ingress-nginx ile auth servisine yonlendırır fakat  oda ayrı bır contaıner'da service'de calısmaktadır. ama bu aşamadada invalid url hatası aldık sanırsam otomatıkma clıent servıce ıcerısınde "https://127.0.0.1/api/users/currentuser" seklınde contaıner'ın localhost'u degılde   api/users/currentuser seklınde kalıyor. cunku ınput log'da  input: '/api/users/currentuser', gorunuyor. zaten contaıner'larda ayrı bır dunya sanal container'ın etkılı alanını otomatıkman koyabılrı yanı localhost dıye "https://127.0.0.1:80/api/users/currentuser" seklınde verseydı  yanı contaıner ıcerısınde yokkı boyle bır uygulama ulaşamaz burdan zaten anlıyoruzkı otomatıkman sanal container'ın local'ını verıyor unutma. öyle olmadıda başına genel tıcketing.dev yanı sanal makınanın ıpsını koysa ozman en baştan o sanal makınaya ıstek atardı anlarsın yanı başına ne koydugunu felan
