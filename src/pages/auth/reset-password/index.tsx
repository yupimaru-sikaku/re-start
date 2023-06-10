import { NextPage } from 'next';
import { AuthLayout } from '@/components/Layout/AuthLayout/AuthLayout';
import { ResetPassword } from '@/components/Auth/ResetPassword';

const ResetPasswordPage: NextPage = () => {
  return (
    <AuthLayout title="パスワードリセット">
      <ResetPassword />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
