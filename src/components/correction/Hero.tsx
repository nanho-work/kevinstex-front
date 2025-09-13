
import Button from "../ui/Button"

export default function Hero() {
    return (
        <section className="text-center py-20 bg-blue-50">
            <h1 className="text-4xl font-bold mb-4">
                놓친 세금,<br className="block md:hidden" /> 경정청구로 돌려받으세요
            </h1>
            <p className="text-lg text-gray-700 mb-6">
                복잡한 절차는 저희가 대신합니다.<br className="block md:hidden" /> 빠르고 안전하게 환급받으세요.
            </p>
            <Button href="/solution" target="_blank" rel="noopener noreferrer" variant="outline">
                원클릭 간편조회
            </Button>
        </section>
    )
}