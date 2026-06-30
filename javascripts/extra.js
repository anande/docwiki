document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector("article.md-post")) return;
  buildArchiveSidebar();
  buildTagsSidebar();
});

function buildArchiveSidebar() {
  var sidebar = document.querySelector(".md-sidebar--secondary");
  if (!sidebar) return;
  sidebar.removeAttribute("hidden");

  var inner = sidebar.querySelector(".md-sidebar__inner");
  if (!inner) return;

  var months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  var base = (document.querySelector("meta[name='base']") || {}).content || "";
  if (!base) {
    var canon = document.querySelector("link[rel=canonical]");
    if (canon) {
      var u = new URL(canon.href);
      base = u.pathname.replace(/index\.html$/, "");
    }
  }

  fetch(base + "search/search_index.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var archive = {};
      var seen = {};
      data.docs.forEach(function (doc) {
        var m = doc.location.match(/^(\d{4})\/(\d{2})\/\d{2}\/([^#/]+)/);
        if (m && !seen[m[3]]) {
          seen[m[3]] = true;
          var y = m[1], mo = parseInt(m[2]) - 1;
          if (!archive[y]) archive[y] = {};
          if (!archive[y][mo]) archive[y][mo] = 0;
          archive[y][mo]++;
        }
      });
      renderArchive(inner, archive, months, base);
    })
    .catch(function () {
      var archive = {};
      document.querySelectorAll("article.md-post time").forEach(function (el) {
        var dt = el.getAttribute("datetime");
        if (!dt) return;
        var d = new Date(dt);
        if (isNaN(d)) return;
        var y = String(d.getFullYear()), mo = d.getMonth();
        if (!archive[y]) archive[y] = {};
        if (!archive[y][mo]) archive[y][mo] = 0;
        archive[y][mo]++;
      });
      renderArchive(inner, archive, months, base);
    });
}

function renderArchive(container, archive, months, base) {
  var html = '<nav class="archive-nav" aria-label="Archive">' +
    '<p class="md-nav__title sidebar-widget-title">Archive</p><ul class="archive-list">';

  Object.keys(archive).sort().reverse().forEach(function (year) {
    html += '<li class="archive-year"><details open><summary>' + year + '</summary><ul>';
    Object.keys(archive[year]).sort(function (a, b) { return b - a; }).forEach(function (mo) {
      var monthNum = String(parseInt(mo) + 1).padStart(2, "0");
      html += '<li><a href="' + base + 'archive/' + year + '/' + monthNum + '/">' +
        months[mo] + '</a> <span class="archive-count">(' + archive[year][mo] + ')</span></li>';
    });
    html += '</ul></details></li>';
  });

  html += '</ul></nav>';
  container.innerHTML = html;
}

function buildTagsSidebar() {
  var base = "";
  var canon = document.querySelector("link[rel=canonical]");
  if (canon) {
    var u = new URL(canon.href);
    base = u.pathname.replace(/index\.html$/, "");
  }

  fetch(base + "tags.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var tagCounts = {};
      (data.mappings || []).forEach(function (entry) {
        (entry.tags || []).forEach(function (tag) {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      });

      var sorted = Object.keys(tagCounts).sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
      });
      if (sorted.length === 0) return;

      var maxCount = Math.max.apply(null, sorted.map(function (t) { return tagCounts[t]; }));

      var widget = document.createElement("div");
      widget.className = "tags-widget";
      widget.innerHTML = '<p class="md-nav__title sidebar-widget-title">Tags</p>';

      var cloud = document.createElement("div");
      cloud.className = "tag-cloud";

      sorted.forEach(function (tag) {
        var a = document.createElement("a");
        var slug = tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        a.href = base + "tags/#" + slug;
        a.className = "tag-pill";
        var scale = 0.75 + 0.5 * (tagCounts[tag] / maxCount);
        a.style.fontSize = scale + "em";
        a.textContent = tag;
        var count = document.createElement("span");
        count.className = "tag-count";
        count.textContent = tagCounts[tag];
        a.appendChild(document.createTextNode(" "));
        a.appendChild(count);
        cloud.appendChild(a);
      });

      widget.appendChild(cloud);

      var scrollwrap = document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap");
      if (scrollwrap) {
        scrollwrap.appendChild(widget);
      }
    })
    .catch(function () {});
}
