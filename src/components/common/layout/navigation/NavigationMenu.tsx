import { getAuthorizedMenu } from "@/actions/layout/navigation.actions";
import NavigationUI from "./NavigationUI";

const NavigationMenu: React.FC = async () => {
  const authorizedMenu = await getAuthorizedMenu();
  // const [menuItems, setMenuItems] = useState<NavigationEntry[]>([]);

  // const scrollableRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (scrollableRef.current) {
  //     new SimpleBar(scrollableRef.current);
  //   }

  //   getAuthorizedMenu().then((items) => {
  //     setMenuItems(items);
  //   });
  // }, []);
  return <NavigationUI authorizedMenu={authorizedMenu} />;

  // return (
  //   <div
  //     ref={scrollableRef}
  //     className={clsx([
  //       "scroll-hidden w-full h-full z-20 px-5 overflow-y-auto overflow-x-hidden pb-3 [-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),black_30px)] [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent",
  //       "[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/30",
  //     ])}
  //   >
  //     <ul className="scrollable">
  //       {menuItems.map((item, idx) => {
  //         switch (item.type) {
  //           case "header":
  //             return <NavigationDivider key={item.title + idx} item={item} />;
  //           case "link":
  //             return <NavigationMenuItem key={item.path} item={item} />;
  //           default:
  //             return null;
  //         }
  //       })}
  //     </ul>
  //   </div>
  // );
};

export default NavigationMenu;
