import type { NextPage } from 'next';
import { AuthLayout } from '@/components/Layout/AuthLayout/AuthLayout';
import { ConfirmEmail } from 'src/components/Auth/ConfirmEmail';

const ConfirmEmailPage: NextPage = () => {
  return (
    <AuthLayout title="Eメール認証">
      <ConfirmEmail />;
    </AuthLayout>
  );
};

export default ConfirmEmailPage;
