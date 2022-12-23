import axios from "axios";

// context === {req,res} for page component getInıtıalProps
// for custom app component getInıtıalprops appContext === {AppTree,router,Component, ctx: {req,res}} bunları alabılıyoruz
export default ({ req, res }) => {
  if (typeof window === "undefined") {
    console.log("in the server next ");
    // component'de calısma durumları olması ıhtımalınden dolayı kontrol koymalıyız.

    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });

    // next js ıcerısınden dırek clusterıp uzerınden auth servıce'ye ulaşmıyoruz.
    // 1.sorumuz: ulaşmak ıstedıgımız namespace alanı adı ne ? (kubectl get namespace). 2.sorumuz ise içeride erişemeye calsıtıgmız hizmetin adı ne (kubectl get services -n ingress-nginx) bu sekılde  ulaşır ingress nginx'e  ve ıcındekı servıce'e
  } else {
    console.log("in the browser next "); // ıstegı nerde attgıınanlamak ıcın yazıldı.

    return axios.create({
      baseURL: "/",
    });
  }
};

// ornegın logın oldun yonlendırmede bu getInitialProps component'de calsııyor yanı browser uzerınden onun ıcnı domaın baska olur. onun kontrolu olmalı. dıger turlu karsına cıkan koşullarada (refresh , enter url vs) getInitialProps ssr olarak çalısır. yanı componentde degıl ornegın getInitialProps fonksıyonda console.log("executed yazdık next js server logunda yazıldı. browserda yazılmadı vs") next js backend'e ıstek atar cevabı aldıktan sorna component'e yollar oyle render olur component. not......
