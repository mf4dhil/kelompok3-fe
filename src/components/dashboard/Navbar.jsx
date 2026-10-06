function Navbar() {
  return (
    <header className="h-20 bg-primary border-b border-primary/10 flex items-center justify-end px-6">
      {/* <div>
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-sm text-white">
          Selamat datang di CakeOrder
        </p>
      </div> */}

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="font-semibold text-primary">
            Admin
          </p>
          <p className="text-xs text-primary/60">
            Administrator
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-semibold">
          A
        </div>
      </div>
    </header>
  );
}

export default Navbar;