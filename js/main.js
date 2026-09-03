// 手机端导航菜单：只保留最基本的展开与收起功能。
const menuButton = document.querySelector(".menu-button");
const mainNavigation = document.querySelector(".main-navigation");

if (menuButton && mainNavigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = mainNavigation.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  // 点击导航链接后自动收起菜单，避免遮挡手机端内容。
  mainNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNavigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}
