import LocalizedDateTime from "@/app/components/common/LocalizedDateTime";
import { IParticipations } from "@/app/lib/definitions";
import { numberFormat } from "@/app/lib/formatters";

export interface ParticipationTableProps {
  participations: IParticipations;
}

const ParticipationTable = ({ participations }: ParticipationTableProps) => {
  return (
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 tabular-nums">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              #
            </th>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Participated At
            </th>
          </tr>
        </thead>
        <tbody>
          {participations.inEvent.map((p, i) => (
            <tr
              key={p.id}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
            >
              <td className="px-6 py-4">{numberFormat.format(i + 1)}</td>
              <td className="px-6 py-4">{`${p.lastName}, ${p.firstName}`}</td>
              <td className="px-6 py-4">{p.email}</td>
              <td className="px-6 py-4">
                <LocalizedDateTime timestamp={p.createdAt.getTime()} />
              </td>
            </tr>
          ))}
        </tbody>
        {participations.inQueue.length > 0 && (
          <tbody>
            <tr>
              <td colSpan={4}>
                <div className="w-full py-3 flex grow items-center text-xs font-semibold text-gray-700 dark:text-gray-400 before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:before:border-neutral-600 dark:after:border-neutral-600">
                  Queue
                </div>
              </td>
            </tr>
            {participations.inQueue.map((p, i) => (
              <tr
                key={p.id}
                className="odd:bg-white odd:dark:bg-red-900 even:bg-red-50 even:dark:bg-red-800 border-b dark:border-red-700"
              >
                <td className="px-6 py-4">
                  {numberFormat.format(
                    i +
                      1 +
                      (participations.participantLimit ??
                        participations.inEvent.length)
                  )}
                </td>
                <td className="px-6 py-4">{`${p.lastName}, ${p.firstName}`}</td>
                <td className="px-6 py-4">{p.email}</td>
                <td className="px-6 py-4">
                  <LocalizedDateTime timestamp={p.createdAt.getTime()} />
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default ParticipationTable;
