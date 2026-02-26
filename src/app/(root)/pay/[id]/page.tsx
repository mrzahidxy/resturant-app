import PayClient from "./pay-client";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

const PayPage = ({ params }: { params: { id: string } }) => {
  return <PayClient id={params.id} />;
};

export default PayPage;
