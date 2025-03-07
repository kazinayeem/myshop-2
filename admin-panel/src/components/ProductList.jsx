import { Chart } from "react-google-charts";
import { useGetCategoriesQuery } from "../redux/Api/categoryApi";
import Loading from "./Loading";


const PieChart = () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();

  if (isLoading) return <Loading/>;
  if (error) return <p>Error loading categories</p>;

  const chartData = [["Category", "Number of Products"]];

  categories?.forEach((category) => {
    chartData.push([category.name, category.product.length || 0]);
  });

  const options = {
    title: "Product Distribution by Category",
    pieHole: 0.4,
    is3D: true,
    slices: {
      0: { offset: 0.1 },
      1: { offset: 0.1 },
      2: { offset: 0.1 },
      3: { offset: 0.1 },
      4: { offset: 0.1 },
    },
    legend: {
      position: "right",
      alignment: "center",
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
      <Chart
        chartType="PieChart"
        data={chartData}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

export default PieChart;
