import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
import { useSideNavContext } from "../SideNavContext";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  const { data } = useSideNavContext();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {data.breadCrumbs?.map((item, index) => (
          <BreadcrumbItem key={index} className="hidden md:block">
            <Link to={item.url}>{item.title}</Link>
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default Breadcrumbs;
