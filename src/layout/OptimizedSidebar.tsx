import { useCallback, useEffect, useRef, useState, memo } from "react";
import { Link, useLocation } from "react-router";
import { zeroReflow } from "../utils/extremePerformanceOptimizer";
import { useSidebar } from "../context/SidebarContext";
import Logo from "../components/common/Logo";
// Lazy load icons to reduce initial bundle
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
} from "../icons/lazy";
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    subItems: [{ name: "Analysis", path: "/" }],
  },
  {
    name: "Management",
    icon: <BoxCubeIcon />,
    subItems: [
      { name: "Projects", path: "/projects" },
      { name: "Categories", path: "/categories" },
      { name: "Blogs", path: "/blogs" },
      { name: "Users", path: "/users" },
    ],
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];
// Memoized submenu component to prevent unnecessary re-renders
const SubMenu = memo<{
  items: NavItem['subItems'];
  isOpen: boolean;
  isActive: (path: string) => boolean;
  isDark: boolean;
}>(({ items, isOpen, isActive, isDark }) => (
  <div
    className="overflow-hidden transition-all duration-300"
    style={{
      height: isOpen ? 'auto' : '0px',
      transform: 'translateZ(0)',
      contain: 'layout style'
    }}
  >
    <ul className="mt-2 space-y-1 ml-9">
      {items?.map((subItem) => (
        <li key={subItem.name}>
          <Link
            to={subItem.path}
            className={`menu-dropdown-item ${
              isActive(subItem.path)
                ? ""
                : "menu-dropdown-item-inactive"
            }`}
            style={isActive(subItem.path) ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
          >
            {subItem.name}
            {subItem.new && (
              <span className="ml-auto menu-dropdown-badge">new</span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  </div>
));
SubMenu.displayName = 'SubMenu';
const OptimizedSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  // Use reflow eliminator for all DOM operations
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  // Memoized active path checker
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );
  // Zero reflow submenu toggle
  const handleSubmenuToggle = useCallback((index: number, menuType: "main" | "others") => {
    zeroReflow.write(() => {
      setOpenSubmenu((prev) => {
        if (prev?.type === menuType && prev?.index === index) {
          return null;
        }
        return { type: menuType, index };
      });
    });
  }, []);
  // Auto-open active submenu on route change
  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: "main", index });
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);
  // Memoized menu items renderer
  const renderMenuItems = useCallback((items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? ""
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
                style={openSubmenu?.type === menuType && openSubmenu?.index === index ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
              >
                <span className="menu-item-icon-size">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered) && (
                  <>
                    <span className="menu-item-text">{nav.name}</span>
                    <ChevronDownIcon
                      className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                        openSubmenu?.type === menuType && openSubmenu?.index === index
                          ? "rotate-180 text-brand-500"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>
              {nav.subItems && (isExpanded || isHovered) && (
                <SubMenu
                  items={nav.subItems}
                  isOpen={openSubmenu?.type === menuType && openSubmenu?.index === index}
                  isActive={isActive}
                  isDark={isDark}
                />
              )}
            </>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "" : "menu-item-inactive"
                }`}
                style={isActive(nav.path) ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
              >
                <span className="menu-item-icon-size">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  ), [isExpanded, isHovered, openSubmenu, handleSubmenuToggle, isActive, isDark]);
  return (
    <>
      {/* Mobile Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 
                   border-r border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100
                   transition-transform duration-300 ease-in-out
                   ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                   w-[260px] sm:w-[280px] px-4 sm:px-5 lg:hidden`}
        style={{ willChange: isMobileOpen ? 'transform' : 'auto' }}
      >
        <div className="py-4 sm:py-6 flex items-center justify-center w-full">
          <Link to="/" className="flex items-center justify-center">
            <Logo textSize="1.25rem" imgWidth={60} imgHeight={60} layout="horizontal" />
          </Link>
        </div>
        <div className="flex flex-col overflow-y-auto flex-1 no-scrollbar pb-6">
          <nav className="mb-6">
            <h2 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              Menu
            </h2>
            <ul className="flex flex-col gap-4">
              {navItems.map((nav, index) => (
                <li key={nav.name}>
                  {nav.subItems ? (
                    <>
                      <button
                        onClick={() => handleSubmenuToggle(index, "main")}
                        className={`menu-item group ${
                          openSubmenu?.type === "main" && openSubmenu?.index === index
                            ? ""
                            : "menu-item-inactive"
                        } cursor-pointer w-full text-left`}
                        style={openSubmenu?.type === "main" && openSubmenu?.index === index ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
                      >
                        <span className="menu-item-icon-size">
                          {nav.icon}
                        </span>
                        <span className="menu-item-text">{nav.name}</span>
                        <ChevronDownIcon
                          className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                            openSubmenu?.type === "main" && openSubmenu?.index === index
                              ? "rotate-180 text-brand-500"
                              : ""
                          }`}
                        />
                      </button>
                      {nav.subItems && (
                        <div
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height: openSubmenu?.type === "main" && openSubmenu?.index === index ? 'auto' : '0px',
                            transform: 'translateZ(0)',
                            contain: 'layout style'
                          }}
                        >
                          <ul className="mt-2 space-y-1 ml-9">
                            {nav.subItems.map((subItem) => (
                              <li key={subItem.name}>
                                <Link
                                  to={subItem.path}
                                  className={`menu-dropdown-item ${
                                    isActive(subItem.path)
                                      ? ""
                                      : "menu-dropdown-item-inactive"
                                  }`}
                                  style={isActive(subItem.path) ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
                                >
                                  {subItem.name}
                                  {subItem.new && (
                                    <span className="ml-auto menu-dropdown-badge">new</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    nav.path && (
                      <Link
                        to={nav.path}
                        className={`menu-item group ${
                          isActive(nav.path) ? "" : "menu-item-inactive"
                        }`}
                        style={isActive(nav.path) ? {backgroundColor: '#27346920', color: isDark ? '#FAFAFF' : '#273469'} : {}}
                      >
                        <span className="menu-item-icon-size">
                          {nav.icon}
                        </span>
                        <span className="menu-item-text">{nav.name}</span>
                      </Link>
                    )
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col top-0 px-4 xl:px-5 left-0 bg-white dark:bg-gray-800 
                   dark:border-gray-700 text-gray-900 dark:text-gray-100 h-screen 
                   transition-all duration-300 ease-in-out border-r border-gray-200 
                   ${isExpanded || isHovered ? "w-[290px]" : "w-[70px]"}`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          willChange: (isExpanded || isHovered) ? 'width' : 'auto',
          contain: 'layout style'
        }}
      >
        <div className="py-6 lg:py-8 flex items-center justify-center w-full">
          <Link to="/" className="flex items-center justify-center">
            {isExpanded || isHovered ? (
              <Logo textSize="1.5rem" imgWidth={80} imgHeight={80} layout="horizontal"/>
            ) : (
              <Logo imgWidth={60} imgHeight={60} showText={false} />
            )}
          </Link>
        </div>
        <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
          <nav className="mb-6">
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "justify-start"
              }`}
            >
              {isExpanded || isHovered ? (
                "Menu"
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>
            {renderMenuItems(navItems, "main")}
          </nav>
        </div>
      </aside>
    </>
  );
};
export default memo(OptimizedSidebar);