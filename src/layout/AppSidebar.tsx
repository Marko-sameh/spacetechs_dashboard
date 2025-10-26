//   import { useCallback, useEffect, useRef, useState } from "react";
//   import { Link, useLocation } from "react-router";

//   // Critical inline icons
//   import {
//     BoxCubeIcon,
//     ChevronDownIcon,
//     GridIcon,
//     HorizontaLDots,
//     UserCircleIcon,
//   } from "../icons/lazy";
//   import { useSidebar } from "../context/SidebarContext";
//   import Logo from "../components/common/Logo";
//   type NavItem = {
//     name: string;
//     icon: React.ReactNode;
//     path?: string;
//     subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
//   };

//   const navItems: NavItem[] = [
//     {
//       icon: <GridIcon />,
//       name: "Dashboard",
//       subItems: [{ name: "Analysis", path: "/" }],
//     },
//     {
//       name: "Management",
//       icon: <BoxCubeIcon />,
//       subItems: [
//         { name: "Projects", path: "/projects" },
//         { name: "Categories", path: "/categories" },
//         { name: "Blogs", path: "/blogs" },
//         { name: "Users", path: "/users" },
//       ],
//     },
//     {
//       icon: <UserCircleIcon />,
//       name: "User Profile",
//       path: "/profile",
//     },

//   ];


//   const AppSidebar: React.FC = () => {
//     const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//     const location = useLocation();

//     const [openSubmenu, setOpenSubmenu] = useState<{
//       type: "main" | "others";
//       index: number;
//     } | null>(null);
//     const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
//       {}
//     );
//     const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
//     const heightCache = useRef<Record<string, number>>({});

//     // const isActive = (path: string) => location.pathname === path;
//     const isActive = useCallback(
//       (path: string) => location.pathname === path,
//       [location.pathname]
//     );

//     useEffect(() => {
//       let submenuMatched = false;
//       ["main", "others"].forEach((menuType) => {
//         const items =  navItems  ;
//         items.forEach((nav, index) => {
//           if (nav.subItems) {
//             nav.subItems.forEach((subItem) => {
//               if (isActive(subItem.path)) {
//                 setOpenSubmenu({
//                   type: menuType as "main" | "others",
//                   index,
//                 });
//                 submenuMatched = true;
//               }
//             });
//           }
//         });
//       });

//       if (!submenuMatched) {
//         setOpenSubmenu(null);
//       }
//     }, [location, isActive]);

//     // Pre-calculate heights on mount to avoid reflows
//     useEffect(() => {
//       const calculateHeights = () => {
//         Object.entries(subMenuRefs.current).forEach(([key, element]) => {
//           if (element && !heightCache.current[key]) {
//             heightCache.current[key] = element.scrollHeight;
//           }
//         });
//       };
      
//       // Use intersection observer to calculate when visible
//       const observer = new IntersectionObserver((entries) => {
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             calculateHeights();
//           }
//         });
//       });
      
//       Object.values(subMenuRefs.current).forEach(el => {
//         if (el) observer.observe(el);
//       });
      
//       return () => observer.disconnect();
//     }, []);
    
//     useEffect(() => {
//       if (openSubmenu !== null) {
//         const key = `${openSubmenu.type}-${openSubmenu.index}`;
//         if (heightCache.current[key]) {
//           setSubMenuHeight(prev => ({ ...prev, [key]: heightCache.current[key] }));
//         }
//       }
//     }, [openSubmenu]);

//     const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//       setOpenSubmenu((prevOpenSubmenu) => {
//         if (
//           prevOpenSubmenu &&
//           prevOpenSubmenu.type === menuType &&
//           prevOpenSubmenu.index === index
//         ) {
//           return null;
//         }
//         return { type: menuType, index };
//       });
//     };

//     const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//       <ul className="flex flex-col gap-4">
//         {items.map((nav, index) => (
//           <li key={nav.name}>
//             {nav.subItems ? (
//               <button
//                 onClick={() => handleSubmenuToggle(index, menuType)}
//                 className={`menu-item group ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-active"
//                     : "menu-item-inactive"
//                 } cursor-pointer ${
//                   !isExpanded && !isHovered
//                     ? "lg:justify-center"
//                     : "lg:justify-start"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size  ${
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered) && (
//                   <>
//                     <span className="menu-item-text">{nav.name}</span>
//                     <ChevronDownIcon
//                       className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                         openSubmenu?.type === menuType &&
//                         openSubmenu?.index === index
//                           ? "rotate-180 text-brand-500"
//                           : ""
//                       }`}
//                     />
//                   </>
//                 )}
//               </button>
//             ) : (
//               nav.path && (
//                 <Link
//                   to={nav.path}
//                   className={`menu-item group ${
//                     isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                   }`}
//                 >
//                   <span
//                     className={`menu-item-icon-size ${
//                       isActive(nav.path)
//                         ? "menu-item-icon-active"
//                         : "menu-item-icon-inactive"
//                     }`}
//                   >
//                     {nav.icon}
//                   </span>
//                   {(isExpanded || isHovered) && <span className="menu-item-text">{nav.name}</span>}
//                 </Link>
//               )
//             )}
//             {nav.subItems && (isExpanded || isHovered) && (
//               <div
//                 ref={(el) => {
//                   subMenuRefs.current[`${menuType}-${index}`] = el;
//                 }}
//                 className="overflow-hidden transition-all duration-300"
//                 style={{
//                   height:
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? `${subMenuHeight[`${menuType}-${index}`] || 'auto'}px`
//                       : "0px",
//                   transform: 'translateZ(0)',
//                   contain: 'layout style'
//                 }}
//               >
//                 <ul className="mt-2 space-y-1 ml-9">
//                   {nav.subItems.map((subItem) => (
//                     <li key={subItem.name}>
//                       <Link
//                         to={subItem.path}
//                         className={`menu-dropdown-item ${
//                           isActive(subItem.path)
//                             ? "menu-dropdown-item-active"
//                             : "menu-dropdown-item-inactive"
//                         }`}
//                       >
//                         {subItem.name}
//                         <span className="flex items-center gap-1 ml-auto">
//                           {subItem.new && (
//                             <span
//                               className={`ml-auto ${
//                                 isActive(subItem.path)
//                                   ? "menu-dropdown-badge-active"
//                                   : "menu-dropdown-badge-inactive"
//                               } menu-dropdown-badge`}
//                             >
//                               new
//                             </span>
//                           )}
//                         </span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>
//     );

//     return (
//       <>
// {/* Mobile Sidebar */}
// {/* ✅ Mobile Sidebar (Fixed) */}
// <aside className="overflow-hidden transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
//   {/* Logo Section */}
//   <div className="py-4 sm:py-6 flex items-center justify-center w-full">
//     <Link to="/" className="flex items-center justify-center">
//       <Logo textSize="1.25rem" imgWidth={60} imgHeight={60} />
//     </Link>
//   </div>

//   {/* Scrollable Menu Section */}
//   <div className="flex flex-col overflow-y-auto flex-1 no-scrollbar pb-6">
//     <nav className="mb-6">
//       <div className="flex flex-col gap-4">
//         <div>
//           <h2 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
//             Menu
//           </h2>

//           {/* ✅ استخدم نفس دالة renderMenuItems بدل تكرار الكود */}
//           {renderMenuItems(navItems, "main")}
//         </div>
//       </div>
//     </nav>
//   </div>
// </aside>




//         {/* Desktop Sidebar */}
//         <aside
//           className={`hidden lg:flex flex-col top-0 px-4 xl:px-5 left-0 bg-white dark:bg-gray-800 
//                     dark:border-gray-700 text-gray-900 dark:text-gray-100 h-screen 
//                     transition-all duration-300 ease-in-out border-r border-gray-200 
//                     ${isExpanded || isHovered ? "w-[290px]" : "w-[70px]"}`}
//           onMouseEnter={() => !isExpanded && setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//         >
//           <div className="py-6 lg:py-8 flex items-center justify-center w-full">
//             <Link to="/" className="flex items-center justify-center">
//               {isExpanded || isHovered ? (
//                 <Logo textSize="1.5rem" imgWidth={80} imgHeight={80} layout="horizontal"/>
//               ) : (
//                 <Logo imgWidth={60} imgHeight={60} showText={false}></Logo>
//               )}
//             </Link>
//           </div>

//           <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
//             <nav className="mb-6">
//               <div className="flex flex-col gap-4">
//                 <div>
//                   <h2
//                     className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                       !isExpanded && !isHovered
//                         ? "lg:justify-center"
//                         : "justify-start"
//                     }`}
//                   >
//                     {isExpanded || isHovered ? (
//                       "Menu"
//                     ) : (
//                       <HorizontaLDots className="size-6 lg:hidden" />
//                     )}
//                   </h2>
//                   {renderMenuItems(navItems, "main")}
//                 </div>
//               </div>
//             </nav>
//           </div>
//         </aside>
//       </>
//     );
//   };

//   export default AppSidebar;


import { Link } from "react-router";
import Logo from "../components/common/Logo";
import { GridIcon, BoxCubeIcon, UserCircleIcon } from "../icons/lazy";

const AppSidebar: React.FC = () => {
  return (
    <>
      {/* ✅ Mobile Sidebar */}
      <aside
        className="
          fixed inset-y-0 left-0 z-50 flex flex-col 
          bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 
          text-gray-900 dark:text-gray-100 
          w-[260px] sm:w-[280px] px-4 sm:px-5 lg:hidden
        "
      >
        {/* Logo Section */}
        <div className="py-4 sm:py-6 flex items-center justify-center w-full">
          <Link to="/" className="flex items-center justify-center">
            <Logo textSize='1.25rem' imgWidth={60} imgHeight={60} layout="horizontal" />
          </Link>
        </div>

        {/* Menu Section */}
        <div className="flex flex-col overflow-y-auto flex-1 no-scrollbar pb-6">
          <nav className="mb-6">
            <h2 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              Menu
            </h2>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <GridIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </li>
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <BoxCubeIcon className="w-5 h-5" />
                <span>Management</span>
              </li>
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <UserCircleIcon className="w-5 h-5" />
                <span>User Profile</span>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* ✅ Desktop Sidebar */}
      <aside
        className="
          hidden lg:flex flex-col top-0 left-0 h-screen 
          px-4 xl:px-5 bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-gray-100
          w-[290px]
          transition-all duration-300 ease-in-out
        "
      >
        {/* Logo */}
        <div className="py-6 lg:py-8 flex items-center justify-center w-full">
          <Link to="/" className="flex items-center justify-center">
            <Logo textSize='1.5rem' imgWidth={80} imgHeight={80} layout="horizontal" />
          </Link>
        </div>

        {/* Menu */}
        <div className="flex flex-col overflow-y-auto no-scrollbar flex-1 pb-6">
          <nav className="mb-6">
            <h2 className="mb-4 text-xs uppercase leading-[20px] text-gray-400">
              Menu
            </h2>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <GridIcon className="w-5 h-5" />
                <span>Dashboard</span>
              </li>
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <BoxCubeIcon className="w-5 h-5" />
                <span>Management</span>
              </li>
              <li className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                <UserCircleIcon className="w-5 h-5" />
                <span>User Profile</span>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
