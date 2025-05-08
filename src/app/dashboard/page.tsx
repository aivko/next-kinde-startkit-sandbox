import {redirect} from "next/navigation";

export default function Dashboard() {
    redirect("/dashboard/account")
  return (
    <div className="container">
      <section className="next-steps-section">
        <h2 className="text-heading-1">Dashboard</h2>
        <h3 className="text-heading-1">
          Here should be a dashboard of users
        </h3>
      </section>
    </div>
  );
}
