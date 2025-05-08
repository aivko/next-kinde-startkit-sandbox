import { redirect } from 'next/navigation';
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
      redirect('/api/auth/login?post_login_redirect_url=/dashboard/account');
  }

  redirect('/dashboard/account');
}
