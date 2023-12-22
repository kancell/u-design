import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Input } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');

  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div className="text-blue-500" onClick={() => {
            console.log(process.env.TITLE)
        }}>111</div>
        <Guide name={trim(name)} />
        <Input />
      </div>
    </PageContainer>
  );
};

export default HomePage;
