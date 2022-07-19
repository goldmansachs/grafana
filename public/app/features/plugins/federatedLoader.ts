// @ts-ignore
declare let __webpack_init_sharing__;
// @ts-ignore
declare let __webpack_share_scopes__;

type FederatedModule = {
  url: string;
  scope: string;
};

export async function importFederatedModule({ url, scope }: FederatedModule) {
  await new Promise<void>((resolve, reject) => {
    const element = document.createElement('script');

    element.src = url;
    element.type = 'text/javascript';
    element.async = true;

    element.onload = () => {
      console.log(`Federated Module Loaded: ${url}`);
      resolve();
    };

    element.onerror = (err) => {
      console.error(`Federated Module Error: ${url}`);
      reject(err);
    };

    document.body.appendChild(element);
  });

  await __webpack_init_sharing__('default');
  // @ts-ignore
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get('./plugin');
  const Module = factory();

  return Module;
}
