import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';
import { Input } from 'antd';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div className='text-blue-500'>111</div>
        <Guide name={trim(name)} />
        <Input />
      </div>
    </PageContainer>
  );
};

export default HomePage;
