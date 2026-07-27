/* =========================================================================
   AY PREMIUM HOMES — config.js
   Detects the site's deployment base path so the same static markup works
   unmodified on localhost, a GitHub Pages project site, and a custom
   domain, then loads the shared favicon + project CSS through it — every
   page includes the same three tags, so centralising them here means
   each page's <head> only needs one <script src> for this file instead
   of repeating BASE_PATH-aware markup three times over.

   Must be the first project script tag on every page (before main.js,
   before the body's local <script> loader, and before the partials are
   fetched) since everything else reads window.BASE_PATH.
   ========================================================================= */

(function () {
  "use strict";

  function detectBasePath() {
    var hostname = window.location.hostname;
    var pathname = window.location.pathname;

    // GitHub Pages project site: served from <user>.github.io/<repo>/...
    // A GitHub Pages *user/org* site (<user>.github.io with no repo
    // segment), localhost, and a custom domain are all served from the
    // actual root, so they fall through to "".
    if (hostname.endsWith(".github.io")) {
      var firstSegment = pathname.split("/").filter(Boolean)[0];
      if (firstSegment) return "/" + firstSegment;
    }

    return "";
  }

  var BASE_PATH = detectBasePath();
  window.BASE_PATH = BASE_PATH;

  function appendLink(attrs) {
    var link = document.createElement("link");
    Object.keys(attrs).forEach(function (key) {
      link.setAttribute(key, attrs[key]);
    });
    document.head.appendChild(link);
  }

  appendLink({ rel: "icon", type: "image/png", href: BASE_PATH + "/assets/images/logo/Web_AY_Logo.png" });
  appendLink({ rel: "stylesheet", href: BASE_PATH + "/assets/css/style.css" });
  appendLink({ rel: "stylesheet", href: BASE_PATH + "/assets/css/responsive.css" });
})();
