// ホーム画面へ遷移するロジック
import { useRouter } from '@nuxtjs/composition-api';
const useHomeRouting = () => {
    const router = useRouter();
    router.push('/');
};
export default useHomeRouting;
