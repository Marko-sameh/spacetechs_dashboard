import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
export default function SignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | SpaceTechs - Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for SpaceTechs - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
          <p className="text-gray-600">Sign up functionality not implemented yet.</p>
        </div>
      </AuthLayout>
    </>
  );
}
