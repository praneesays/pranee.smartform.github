import { Router, NavigationEnd } from '@angular/router';

export function tokenRouterListener(router: Router) {
  return () => {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const urlTree = router.parseUrl(event.url);
        urlTree.queryParams = {
          ...urlTree.queryParams,
          token: '12345'
        };
        router.navigateByUrl(urlTree);
      }
    });
  };
}
