export default function Footer() {
    return (
        <footer className="bg-muted">
            <div className="container mx-auto px-6 py-6 flex items-center justify-between text-sm text-muted-foreground">
                <p>
                    Built with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-foreground">Next.js</a>
                </p>
                <p>
                    &copy; {new Date().getFullYear()} Burning Bros. All rights reserved.
                </p>
            </div>
        </footer>
    );
}