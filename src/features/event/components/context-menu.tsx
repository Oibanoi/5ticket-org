// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import axios, { AxiosError } from "axios";
// import Link from "next/link";

// import { MdDone, MdOutlineCancel } from "react-icons/md";
// import { TbEdit, TbReport, TbTrash } from "react-icons/tb";
// import { HiClipboardDocumentList } from "react-icons/hi2";
// import { FaRunning, FaTicketAlt } from "react-icons/fa";

// type Props = {};

// const ContextMenuEvent = (props: Props) => {
//   const queryClient = useQueryClient();
//   const updateMutation = useUpdateRaceStatus();
//   const deleteMutaion = useMutation((payload: any) => Race.delete(payload), {
//     onMutate(variables) {
//       const toastId = toast.loading("Đang xoá");
//       return { toastId };
//     },
//     onSuccess(data, variables, context) {
//       queryClient.invalidateQueries([Race.PLURAL]);
//       toast.success("Xoá sự kiện thành công", { id: context?.toastId });
//     },
//     onError(
//       error: AxiosError<Response.FormatError<{ code: number; message: string }>>,
//       variables,
//       context
//     ) {
//       let msg = "Xoá sự kiện thất bại";
//       if (axios.isAxiosError(error)) {
//         if (error.response!.data.error.code == 400) {
//           msg = "Không thể xoá sự kiện không phải nháp";
//         } else {
//           msg = error.response!.data.error.message;
//         }
//       }
//       toast.error(msg, { id: context?.toastId });
//     },
//   });

//   const onDelete = (id: number) => {
//     confirm(
//       {
//         title: "WARNING",
//         content: "Hành động này không thể hoàn tác, bạn có chắc chắn xoá race này?",
//       },
//       function () {
//         return deleteMutaion.mutateAsync(id);
//       }
//     );
//   };

//   const className =
//     "px-2 py-1 rounded flex w-full items-center gap-2 transition hover:bg-gray-100 dark:hover:bg-secondary-700 cursor-pointer";
//   return (
//     <ContextMenu<Data.RaceDetailList>
//       renderData={(props) => {
//         return (
//           <div className="max-w-xs w-44 bg-base-100 rounded-lg shadow divide-y dark:divide-zinc-600 text-sm">
//             <ShowOnAvaiable>
//               <ContextMenu.List>
//                 <Link
//                   href={{ pathname: EventRouters.ORDER, query: { id: props.id } }}
//                   className={className}
//                 >
//                   <HiClipboardDocumentList size={18} />
//                   Đơn hàng
//                 </Link>
//                 <Link
//                   href={{ pathname: EventRouters.ATHLETE, query: { id: props.id } }}
//                   className={className}
//                 >
//                   <FaRunning size={18} />
//                   Danh sách VĐV
//                 </Link>
//                 <Link
//                   href={{ pathname: EventRouters.TICKET, query: { id: props.id } }}
//                   className={className}
//                 >
//                   <FaTicketAlt size={18} />
//                   Danh sách vé
//                 </Link>
//                 <Link
//                   href={{ pathname: EventRouters.TICKET, query: { id: props.id } }}
//                   className={className}
//                 >
//                   <TbReport size={18} />
//                   Yêu cầu xử lý
//                 </Link>
//               </ContextMenu.List>
//             </ShowOnAvaiable>
//             <ShowOnAvaiable
//               roles={[
//                 UserTenantRole.SYS_ADMIN,
//                 UserTenantRole.TENANT_OWNER,
//                 UserTenantRole.TENANT_ADMIN,
//                 UserTenantRole.OPERATOR,
//               ]}
//             >
//               <ContextMenu.List>
//                 <Link
//                   href={{ pathname: EventRouters.EDIT, query: { id: props.id } }}
//                   className={className}
//                 >
//                   <TbEdit size={18} />
//                   Sửa
//                 </Link>
//                 {[
//                   {
//                     title: "Huỷ",
//                     value: ListRaceStatus.Cancel,
//                     Icon: MdOutlineCancel,
//                     disabled: props.status !== ListRaceStatus.Draft,
//                   },
//                   {
//                     title: "Xuất bản",
//                     value: ListRaceStatus.GeneratedCode,
//                     Icon: MdDone,
//                     disabled: props.status !== ListRaceStatus.Draft,
//                   },
//                 ].map((v) =>
//                   v.disabled ? null : (
//                     <button
//                       key={v.value}
//                       onClick={() => updateMutation.mutate({ id: props.id, status: v.value })}
//                       type="button"
//                       disabled={v.disabled || updateMutation.isLoading}
//                       className={className}
//                     >
//                       <v.Icon size={18} />
//                       {v.title}
//                     </button>
//                   )
//                 )}
//               </ContextMenu.List>
//               <ContextMenu.List>
//                 <button
//                   onClick={() => onDelete(props.id)}
//                   className="px-2 py-1 rounded flex w-full items-center gap-2 hover:text-red-600 hover:bg-red-100 transition"
//                 >
//                   <TbTrash size={18} />
//                   Xoá
//                 </button>
//               </ContextMenu.List>
//             </ShowOnAvaiable>
//           </div>
//         );
//       }}
//     />
//   );
// };

// export default ContextMenuEvent;
