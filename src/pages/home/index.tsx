import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Input } from 'antd';
import styles from './index.less';

import store from '@/store';
import { useSnapshot } from '@umijs/max';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const { count } = useSnapshot(store);
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <div className="text-blue-500">111</div>
        <Guide name={trim(name)} />
        <Input />
        {count}
      </div>
    </PageContainer>
  );
};

export default HomePage;
