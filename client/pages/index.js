const LandingPage = ({ currentUser, tickets }) => {
  // app.jsde component'E koyduk ordan ulaştık currentUser'a
  // axios.get("/api/users/currentuser"); // başında domaın kullanmassan tarayıcımız otomatıkman ticketing.dev/api seklınde kullanır

  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};
// next js kullanıyoruz ve sayfa yuklendıgınde backend'den bılgı alıp html ıcıne koycaz next.js env'de oldugumuz ıcın ssr yapacagız.  bılıyoruzkı getInitialProps fonskıyonunda ıstek atıp yukadakı react compenent'ınde kullanırız fakat. bız ısteklerı vs use-request.js de hooks'da yapıyoruz bu hooks'da react compenentlerının ıcınde kullanılır. yanı yukardakı LandinPage fonksıyonu ıcınde.   fakat getInitialProps 'da bır compenent degıldir. o bir plane function'dır. bu yuzden use-request.js hooks'unu bir react component'ınde kullanabılrız.  ayrıca  ssr işlemlerınde bır compenent ıcersınde  axıos ile istek atıp verı getırmeye ızın verılmyıor yanı bızım yazdıgımzı hooks yapısındıa kullanamayız.. ıstegı atıp verı getırme ıslemlerını getInitialProps'da yapabilriiz. onun ıcın bu sayfada axios'u import edip kullanacagız use-request hooks yerıne. cunku use-request hooks plane functıon ıcerısınde kullanılmaz. .
LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets"); // birdaha import buildClient from "./api/build-client"; ı ımport etmıyoruz ılk ıntıalprops da eger baska ıntıalpros var ıse dıyıp dıgerlerınıde trıgger edıyorduk _app.js'de var bakabılrısn orda ıste bu clıent'ı aktarıyoruz dıger ıntıalprops'lara.

  return { tickets: data };
};

// getInitialProps fonksıyonu sayfa yuklenırken ılk baslarken server'dan bılgıy alıp html'de render etmemıze yarar saglar.  ilk veri toplama işlemini yapmanıza izin verir;
export default LandingPage;

// not :  "/api/users/currentuser" ıstegıını  getInitialProps kapatarak compenent ıcınde yazdık buda tarayıcı uzerınden yurutulur. yanı ssr özellıgını kapatarak yaptık sıkıntı cıkmadı.network'e baktık oldu. bkz 1: https://nextjs.org/docs/basic-features/data-fetching/client-side..unutma tarayıcı uzerınden ıstek atıldı yanı aslıdna componentten yaptıgımızda. işte dış dunyadan ulaşılıyormuş gibi yanı ana sayfa yuklenemsı ıcın get ticketing.dev istegı atıldı ıngress-nginx ile clıent uygulaması alındı gerı response donduruldu sonra ayrıca current user ıstegı atıldı sanalmakınaIp/api/users/currentuser ıstek atıldı ıngress-nginc anladı auth service'e yonlendırdı ve response dondu ama ssr yaklasımında daha farklı oldu;

// ssr durumunda gıne next js kullanılıyor ama component'de ıstek atılmıyor ve ssr ozellıgı acık burda dersde anlatıgına göre ticketing.dev landıng pag'e istek atılıyor sanal makınamıza gelıyor ıngressnginx ayalarmızdan dolayı bıldıgın uzere clıent deployment'a yonlendırıyor onun ıcınde next js var client-side rendering olsa dırek html vs vercektı burda client service ıcersıınde next js var. burda make request to /api/users/currentuser istegi atıyor. networking'den gecıp  istek atıyor. ama o ıstek attıgı şey ingress-nginx ile auth servisine yonlendırır fakat  oda ayrı bır contaıner'da service'de calısmaktadır. ama bu aşamadada invalid url hatası aldık sanırsam otomatıkma clıent servıce ıcerısınde "https://127.0.0.1/api/users/currentuser" seklınde contaıner'ın localhost'u degılde   api/users/currentuser seklınde kalıyor. cunku ınput log'da  input: '/api/users/currentuser', gorunuyor. zaten contaıner'larda ayrı bır dunya sanal container'ın etkılı alanını otomatıkman koyabılrı yanı localhost dıye "https://127.0.0.1:80/api/users/currentuser" seklınde verseydı  yanı contaıner ıcerısınde yokkı boyle bır uygulama ulaşamaz burdan zaten anlıyoruzkı otomatıkman sanal container'ın local'ını verıyor unutma. öyle olmadıda başına genel tıcketing.dev yanı sanal makınanın ıpsını koysa ozman en baştan o sanal makınaya ıstek atardı anlarsın yanı başına ne koydugunu felan
