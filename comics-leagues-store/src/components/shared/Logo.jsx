import {Link} from 'react-router-dom';
export const Logo = () => {
    return (
        <Link to='/' className={`text-2x1 font-bold tracking-tighter transition-all`}>
            <p className=' hidden text-cyan-500 text-3xl lg:block '>
                Comic
                <span className='text-3xl text-cyan-600'>League</span>
                <span className='text-cyan-800 text-3xl'>Store</span>
            </p>
            <p className='flex text-4xl lg:hidden'>
                <span className='-skew-x-6 text-cyan-500'>C</span>
                <span className='text-cyan-600 skew-x-6'>L</span>
                <span className='text-cyan-800 skew-x-6'>S</span>
            </p>
        </Link>
    )
}