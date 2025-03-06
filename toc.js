// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><a href="chapter1/index.html"><strong aria-hidden="true">1.</strong> 介绍</a></li><li class="chapter-item expanded "><a href="chapter2/index.html"><strong aria-hidden="true">2.</strong> 快速开始</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter2/section1.html"><strong aria-hidden="true">2.1.</strong> 插件安装与使用</a></li><li class="chapter-item expanded "><a href="chapter2/section2.html"><strong aria-hidden="true">2.2.</strong> Hello World 实战</a></li><li class="chapter-item expanded "><a href="chapter2/section3.html"><strong aria-hidden="true">2.3.</strong> 语法介绍</a></li></ol></li><li class="chapter-item expanded "><a href="chapter3/index.html"><strong aria-hidden="true">3.</strong> 入门指南</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter3/section1.html"><strong aria-hidden="true">3.1.</strong> Hello World 实现</a></li><li class="chapter-item expanded "><a href="chapter3/section2.html"><strong aria-hidden="true">3.2.</strong> 生成 Swagger 文档</a></li><li class="chapter-item expanded "><a href="chapter3/section3.html"><strong aria-hidden="true">3.3.</strong> 生成 TypeScript 定义</a></li></ol></li><li class="chapter-item expanded "><a href="chapter4/index.html"><strong aria-hidden="true">4.</strong> 进阶操作</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter4/section1.html"><strong aria-hidden="true">4.1.</strong> XORM 代码生成</a></li><li class="chapter-item expanded "><a href="chapter4/section2.html"><strong aria-hidden="true">4.2.</strong> 生成其他语言协议</a></li><li class="chapter-item expanded "><a href="chapter4/section3.html"><strong aria-hidden="true">4.3.</strong> endcmd 命令使用和讲解</a></li></ol></li><li class="chapter-item expanded "><a href="chapter5/index.html"><strong aria-hidden="true">5.</strong> 配套管理后台</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter5/section1.html"><strong aria-hidden="true">5.1.</strong> admin-core 引入</a></li><li class="chapter-item expanded "><a href="chapter5/section2.html"><strong aria-hidden="true">5.2.</strong> 访问权限</a></li><li class="chapter-item expanded "><a href="chapter5/section3.html"><strong aria-hidden="true">5.3.</strong> API 级权限校验</a></li><li class="chapter-item expanded "><a href="chapter5/section4.html"><strong aria-hidden="true">5.4.</strong> vue3-element-admin 指南</a></li><li class="chapter-item expanded "><a href="chapter5/section5.html"><strong aria-hidden="true">5.5.</strong> FAQ</a></li></ol></li><li class="chapter-item expanded "><a href="chapter6/section1.html"><strong aria-hidden="true">6.</strong> 致谢</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="chapter6/section2.html"><strong aria-hidden="true">6.1.</strong> FAQ</a></li></ol></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
