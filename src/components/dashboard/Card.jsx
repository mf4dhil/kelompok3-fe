function StatCard({
  title,
  value,
  description,
  icon,
  iconColor
}) {

  return (
    <div className="bg-white rounded-xl border border-primary/10 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-primary/60">
            {title}
          </p>
          <h2 className="text-3xl font-bold text-primary mt-2">
            {value}
          </h2>
          <p className="text-xs text-primary/50 mt-2">
            {description}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center text-xl`}
        >
          {icon}
        </div>
      </div>

    </div>
  );
}

export default StatCard;