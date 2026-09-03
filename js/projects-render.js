/* 使用 data/projects.js 同步首页、作品索引、分类页和详情页的公共项目数据。 */
(function () {
  "use strict";

  const projects = window.PORTFOLIO_PROJECTS || [];
  const projectsById = window.PORTFOLIO_PROJECTS_BY_ID || {};

  if (!projects.length) return;

  const padNumber = (value) => String(value).padStart(2, "0");
  const detailFilename = (project) => project.detail.split("/").pop();

  function applyProjectTitleTypography(target, project) {
    if (!target) return;

    target.classList.remove("title-style-en", "title-style-cn", "title-style-mixed");
    target.classList.add(`title-style-${project.titleStyle || "cn"}`);

    if (project.titleStyle === "mixed" && project.nameZh && project.nameEn) {
      const chinese = document.createElement("span");
      chinese.className = "project-title-part project-title-part--cn";
      chinese.textContent = project.nameZh;
      const english = document.createElement("span");
      english.className = "project-title-part project-title-part--en";
      english.textContent = project.nameEn;
      target.replaceChildren(chinese, english);
    } else {
      target.textContent = project.name;
    }
  }

  function createMedia(project, displayNumber) {
    const link = document.createElement("a");
    link.className = "work-card-media";
    link.href = project.detail;
    link.setAttribute("aria-label", `查看${project.name}`);

    if (project.cover) {
      const image = document.createElement("img");
      image.src = project.cover;
      image.alt = `${project.name}项目主视觉`;
      image.loading = "lazy";
      link.append(image);
      return link;
    }

    link.classList.add("work-placeholder");
    const number = document.createElement("span");
    number.className = "work-placeholder-number";
    number.textContent = padNumber(displayNumber);
    const label = document.createElement("small");
    label.textContent = `${project.categoryEn} / TO BE UPDATED`;
    link.append(number, label);
    return link;
  }

  function createProjectTitle(project) {
    const heading = document.createElement("h2");
    heading.className = "work-card-title";

    if (project.titleStyle === "en") heading.classList.add("work-card-title--en");
    if (project.titleStyle === "mixed") heading.classList.add("work-card-title--mixed");

    const link = document.createElement("a");
    link.href = project.detail;

    if (project.titleStyle === "mixed") {
      const chinese = document.createElement("span");
      chinese.className = "work-card-title-cn";
      chinese.textContent = project.nameZh;
      const english = document.createElement("span");
      english.className = "work-card-title-en";
      english.textContent = project.nameEn;
      link.append(chinese, english);
    } else {
      link.textContent = project.name;
    }

    heading.append(link);
    return heading;
  }

  function createProjectInfo(project, displayNumber) {
    const info = document.createElement("div");
    info.className = "work-card-info";

    const meta = document.createElement("p");
    meta.className = "work-card-meta";
    const category = document.createElement("span");
    category.textContent = `${padNumber(displayNumber)} / ${project.categoryEn}`;
    const time = document.createElement("time");
    time.dateTime = project.year;
    time.textContent = project.year;
    meta.append(category, time);

    const type = document.createElement("p");
    type.className = "work-card-type";
    type.textContent = project.type;

    const description = document.createElement("p");
    description.className = "work-card-description";
    description.textContent = project.description;

    const projectLink = document.createElement("a");
    projectLink.className = "work-card-link";
    projectLink.href = project.detail;
    projectLink.append("查看项目 ");
    const arrow = document.createElement("span");
    arrow.textContent = "→";
    projectLink.append(arrow);

    info.append(meta, createProjectTitle(project), type, description, projectLink);
    return info;
  }

  function createProjectCard(project, context) {
    const article = document.createElement("article");
    article.className = "work-item";
    article.dataset.projectId = project.id;

    const extraClasses = context === "all" ? project.workClass : project.categoryClass;
    if (extraClasses) article.classList.add(...extraClasses.split(/\s+/).filter(Boolean));

    const displayNumber = context === "all" ? project.order : project.categoryOrder;
    const media = createMedia(project, displayNumber);
    const info = createProjectInfo(project, displayNumber);

    if (article.classList.contains("work-item--horizontal")) {
      const horizontalGrid = document.createElement("div");
      horizontalGrid.className = "work-horizontal-grid";
      horizontalGrid.append(media, info);
      article.append(horizontalGrid);
    } else {
      article.append(media, info);
    }

    return article;
  }

  function renderProjectGrids() {
    document.querySelectorAll("[data-project-grid]").forEach((grid) => {
      const context = grid.dataset.projectGrid;
      const list = context === "all"
        ? [...projects].sort((a, b) => a.order - b.order)
        : projects.filter((project) => project.category === context).sort((a, b) => a.categoryOrder - b.categoryOrder);

      grid.replaceChildren(...list.map((project) => createProjectCard(project, context)));
    });
  }

  function renderHomeFeatured() {
    const featured = document.querySelector("[data-home-featured]");
    if (featured) {
      const project = projectsById[featured.dataset.homeFeatured];
      if (project) {
        const media = document.createElement("div");
        media.className = "featured-media";
        const image = document.createElement("img");
        image.className = "project-image project-image-featured";
        image.src = project.cover;
        image.alt = `${project.name}项目主视觉`;
        media.append(image);

        const info = document.createElement("div");
        info.className = "featured-info";
        const code = document.createElement("p");
        code.className = "project-code";
        code.textContent = `${padNumber(project.order)} / FEATURED PROJECT`;
        const title = document.createElement("h3");
        applyProjectTitleTypography(title, project);
        const type = document.createElement("p");
        type.className = "project-type-line";
        type.textContent = project.type;
        const summary = document.createElement("p");
        summary.className = "project-summary";
        summary.textContent = project.description;

        const details = document.createElement("dl");
        details.className = "project-details";
        const roleRow = document.createElement("div");
        const roleTerm = document.createElement("dt");
        roleTerm.textContent = "ROLE";
        const roleValue = document.createElement("dd");
        roleValue.textContent = project.featuredRole || "待补充";
        roleRow.append(roleTerm, roleValue);
        const yearRow = document.createElement("div");
        const yearTerm = document.createElement("dt");
        yearTerm.textContent = "YEAR";
        const yearValue = document.createElement("dd");
        yearValue.textContent = project.year;
        yearRow.append(yearTerm, yearValue);
        details.append(roleRow, yearRow);

        const link = document.createElement("a");
        link.className = "text-link";
        link.href = project.detail;
        link.append("查看项目 ");
        const arrow = document.createElement("span");
        arrow.textContent = "→";
        link.append(arrow);

        info.append(code, title, type, summary, details, link);
        featured.replaceChildren(media, info);
      }
    }

    document.querySelectorAll("[data-home-selected]").forEach((card) => {
      const project = projectsById[card.dataset.homeSelected];
      if (!project) return;

      const image = document.createElement("img");
      image.className = card.classList.contains("selected-project-offset")
        ? "project-image project-image-wide"
        : "project-image project-image-landscape";
      image.src = project.cover;
      image.alt = `${project.name}项目主视觉`;

      const info = document.createElement("div");
      info.className = "selected-project-info";
      const titleGroup = document.createElement("div");
      const code = document.createElement("p");
      code.className = "project-code";
      code.textContent = `${padNumber(project.order)} / FEATURED PROJECT`;
      const title = document.createElement("h3");
      applyProjectTitleTypography(title, project);
      titleGroup.append(code, title);
      const type = document.createElement("p");
      type.className = "selected-project-type";
      type.textContent = project.type;
      const year = document.createElement("p");
      year.className = "selected-project-year";
      year.textContent = project.year;
      info.append(titleGroup, type, year);

      const projectLink = document.createElement("a");
      projectLink.className = "selected-project-link";
      projectLink.href = project.detail;
      projectLink.setAttribute("aria-label", `查看项目：${project.name}`);
      projectLink.append(image, info);
      card.replaceChildren(projectLink);
    });
  }

  function updateMetaRow(label, value) {
    document.querySelectorAll(".project-meta-row").forEach((row) => {
      const term = row.querySelector("dt");
      const detail = row.querySelector("dd");
      if (term && detail && term.textContent.trim() === label) detail.textContent = value;
    });
  }

  function hydrateProjectDetail() {
    if (!document.body.classList.contains("project-detail-page")) return;

    const filename = decodeURIComponent(window.location.pathname.split("/").pop());
    const projectIndex = projects.findIndex((project) => detailFilename(project) === filename);
    if (projectIndex < 0) return;

    const project = projects[projectIndex];
    document.body.dataset.projectId = project.id;
    document.title = `${project.name}｜ZHOU YUNXIN`;

    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) descriptionMeta.content = `${project.name}项目详情页。`;

    const overviewTitle = document.querySelector(".project-overview-title--series");
    applyProjectTitleTypography(overviewTitle, project);

    const heroTitle = document.querySelector(".project-hero-title");
    applyProjectTitleTypography(heroTitle, project);
    const heroSubtitle = document.querySelector(".project-hero-subtitle");
    if (heroSubtitle) heroSubtitle.textContent = project.type;
    const heroSummary = document.querySelector(".project-hero-summary");
    if (heroSummary) heroSummary.textContent = project.description;
    const heroEyebrow = document.querySelector(".project-hero-eyebrow");
    if (heroEyebrow) heroEyebrow.textContent = `${padNumber(project.order)} / ${project.categoryEn}`;
    const heroImage = document.querySelector(".project-hero-media img");
    if (heroImage) heroImage.alt = `${project.name}项目主视觉`;

    updateMetaRow("项目名称", project.name);
    updateMetaRow("项目类型", project.type);
    updateMetaRow("项目时间", project.year);

    const ordered = [...projects].sort((a, b) => a.order - b.order);
    const currentOrderedIndex = ordered.findIndex((item) => item.id === project.id);
    const previous = ordered[(currentOrderedIndex - 1 + ordered.length) % ordered.length];
    const next = ordered[(currentOrderedIndex + 1) % ordered.length];
    const navigationLinks = document.querySelectorAll(".project-navigation-link:not(.project-navigation-link--all)");

    if (navigationLinks.length >= 2) {
      navigationLinks[0].href = detailFilename(previous);
      const previousName = navigationLinks[0].querySelector(".project-navigation-name");
      applyProjectTitleTypography(previousName, previous);

      navigationLinks[navigationLinks.length - 1].href = detailFilename(next);
      const nextName = navigationLinks[navigationLinks.length - 1].querySelector(".project-navigation-name");
      applyProjectTitleTypography(nextName, next);
    }
  }

  function initProjectData() {
    renderProjectGrids();
    renderHomeFeatured();
    hydrateProjectDetail();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectData, { once: true });
  } else {
    initProjectData();
  }
})();
