import CurvedLoop from '@/components/ui/curvedloop';

export default function TestPage() {
    return (
        <div className="min-h-screen bg-white">
            <CurvedLoop
                marqueeText="React ✦ Animation ✦ Fun ✦ Portfolio ✦"
                speed={2}
                curveAmount={400}
                direction="right"
                interactive={true}
                className="fill-red"
            />
        </div>
    );
}
