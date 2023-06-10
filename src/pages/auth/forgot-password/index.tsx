import { NextPage } from 'next';
import { AuthLayout } from '@/components/Layout/AuthLayout/AuthLayout';
import { ForgotPassword } from '@/components/Auth/ForgotPassword';

const ForgotPasswordPage: NextPage = () => {
  return (
    <AuthLayout title="パスワードをお忘れですか？">
      <ForgotPassword />
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
