/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from "react";
import { fetchUserData } from "../Api/api";
import Pagination from "../Pagination/pagination";
import update from 'immutability-helper';
import Alerts from "../Alerts/alerts";
import ContentLoader from 'react-content-loader';

export default function Table() {
    const [data, setData] = useState([]);
    const [startIndex, setStartIndex] = useState(0);
    const [searchedText, setSearchedText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [alertMessage, setAlertMessage] = useState(false);
    const [endIndex, setEndIndex] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleteAll, setDeleteAll] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);
    const [deleteRow, setDeleteRow] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameInputRefs = useRef([]);
    const emailInputRefs = useRef([]);
    const roleInputRefs = useRef([]);

    const Loader = () => {
        const random = 0.9304694484320217;
        return (
            <ContentLoader
                height={60}
                width={1060}
                speed={2}
                backgroundColor="#fff"
                foregroundColor="#e7e7e7"
            >
                <rect x="30" y="8" rx="4" ry="4" width="6" height="6.4" />
                <rect x="64" y="6" rx="6" ry="6" width={200 * random} height="12" />
                <rect x="643" y="6" rx="6" ry="6" width={23 * random} height="12" />
                <rect x="683" y="6" rx="6" ry="6" width={78 * random} height="12" />
                <rect x="785" y="6" rx="6" ry="6" width={117 * random} height="12" />
                <rect x="968" y="6" rx="6" ry="6" width={83 * random} height="12" />

                <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3" />
            </ContentLoader>
        );
    };

    const generateData = async () => {
        try {
            setLoading(true);
            const res = await fetchUserData();
            setLoading(false);
            setData(res);
            setTotalItems(res.length);
            setEndIndex(10);
        } catch (err) {
            console.log(err);
        }
    };
    const handleNameChange = (index, newName) => {
        const updatedData = update(data, {
            [index]: {
                name: { $set: newName }
            }
        });
        setData(updatedData);
        nameInputRefs.current[index].focus();
    };
    const handleEmailChange = (index, newEmail) => {
        const updatedData = update(data, {
            [index]: {
                email: { $set: newEmail }
            }
        });
        setData(updatedData);
        emailInputRefs.current[index].focus();
    };
    const handleRoleChange = (index, newRole) => {
        const updatedData = update(data, {
            [index]: {
                role: { $set: newRole }
            }
        });
        setData(updatedData);
        roleInputRefs.current[index].focus();
    };
    const handleRowClick = (index) => {
        setSelectedRows((prevSelectedRows) => {
            const isSelected = prevSelectedRows.includes(index);
            setDeleteRow(false);
            if (isSelected) {
                setDeleteIds(prevSelectedRows);
                return update(prevSelectedRows, { $splice: [[prevSelectedRows.indexOf(index), 1]] });
            } else {
                setDeleteRow(true);
                return update(prevSelectedRows, { $push: [index] });
            }
        });
    };
    const handleAllClick = (startIndex, endIndex) => {
        setSelectedRows((prevSelectedRows) => {
            const selectedRange = Array.from({ length: endIndex - startIndex + 1 }, (_, i) => startIndex + i);
            const newSelectedRows = selectedRange.filter((index) => !prevSelectedRows.includes(index));
            const updateObject = newSelectedRows.length > 0
                ? { $push: newSelectedRows }
                : { $apply: (rows) => rows.filter((index) => !selectedRange.includes(index)) };
            newSelectedRows.length > 0 ? setDeleteAll(true) : setDeleteAll(false);
            return update(prevSelectedRows, updateObject);
        });
    };
    const deleteAllUsers = (startIndex, endIndex) => {
        const updatedWorkspace = update(data, {
            $splice: [[startIndex, endIndex]]
        })
        setData(updatedWorkspace);
        setAlertMessage(true);
        setTimeout(() => {
            setAlertMessage(false);
        }, 3000)
        setSelectedRows([]);
    }
    const deleteSelectedUsers = () => {
        const updatedWorkspace = update(data, {
            $splice: [[deleteIds, deleteIds.length]]
        })
        setData(updatedWorkspace);
        setAlertMessage(true);
        setTimeout(() => {
            setSelectedRows([]);
            setAlertMessage(false);
        }, 3000)
    }
    const Searchfilter = (e) => {
        setTimeout(() => {
            const filter = data.filter((v) => (v.name.toLowerCase().includes( e.target.value.toLowerCase())) || (v.email.toLowerCase() === e.target.value.toLowerCase()) || (v.role.toLowerCase() === e.target.value.toLowerCase()));
            setData(filter);
        }, 1000)

    }
    useEffect(() => {
        generateData();
    }, [searchedText]);

    return (
        <>
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center mt-5 mb-3">
                    <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold leading-6 text-gray-900 ml-8">
                            Users
                        </h1>
                    </div>
                    {deleteAll && (
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none mr-8">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    deleteAllUsers(startIndex, endIndex);
                                }}
                                type="button"
                                className="block rounded-md bg-indigo-600 px-3 py-2  text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Delete All Users
                            </button>
                        </div>
                    )}
                </div>

                <div className="ml-7 mr-8">
                    <div className="relative mt-0 flex items-center">
                        <div className="absolute left-3">
                            <svg
                                width="17"
                                height="17"
                                viewBox="0 0 17 17"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M16.0007 16.0007L11.6698 11.6698M11.6698 11.6698C12.842 10.4977 13.5005 8.9079 13.5005 7.25023C13.5005 5.59257 12.842 4.0028 11.6698 2.83065C10.4977 1.6585 8.9079 1 7.25023 1C5.59257 1 4.0028 1.6585 2.83065 2.83065C1.65851 4.0028 1 5.59257 1 7.25023C1 8.9079 1.6585 10.4977 2.83065 11.6698C4.0028 12.842 5.59257 13.5005 7.25023 13.5005C8.9079 13.5005 10.4977 12.842 11.6698 11.6698V11.6698Z"
                                    stroke="#6B7280"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <input
                            type="text"
                            name="search"
                            id="search"
                            onChange={(e) => {
                                setSearchedText(e.target.value);
                                Searchfilter(e);

                            }}
                            value={searchedText}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setSearchedText(e.target.value);
                                    Searchfilter(e.target.value);
                                }
                            }}
                            autoComplete="off"
                            placeholder="Search by name, email or role"
                            className="block w-full sm:min-w-[350px] h-10 pl-10 rounded-md border border-gray-200 pr-12 focus:border-primary focus:ring-primary sm:text-sm"
                        />

                        <div
                            className="h-6 w-6 text-gray-400 hover:text-primary absolute right-1 cursor-pointer"
                            onClick={() => {
                                setSearchedText('');
                            }}
                            data-tip="<p>Clear Search</p>"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>
                {alertMessage && (
                    <div className="px-8 py-3">
                        <Alerts />
                    </div>
                )}
                {loading ? (
                    <div className="">
                        <div className="py-4 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
                            {Array(data && data.length > 0 ? data.length + 1 : 20)
                                .fill('')
                                .map((_e, i) => (
                                    <Loader key={i} />
                                ))}
                        </div>
                    </div>) : (
                    <div id="table-container" className="-my-2 overflow-hidden overflow-x-auto">
                        {data === undefined || data.length === 0 ? (
                            <>
                                <div className="align-middle inline-block min-w-full">
                                    <div className="shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg">
                                        <p className="text-center h-60 flex items-center justify-center text-gray-300">
                                            No User Found
                                        </p>
                                    </div>
                                </div>
                            </>) : (
                            <div className="py-5 px-8 align-middle inline-block min-w-full">
                                <div className="overflow-hidden border border-gray-200 sm:rounded-lg relative">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <a
                                                    id="disable"
                                                    aria-describedby="disable-description"
                                                    name="disable"
                                                    onClick={() => {
                                                        handleAllClick(startIndex, endIndex);

                                                    }}
                                                    type="button"
                                                    className="h-4 w-4 mt-4 ml-5  mb-6 relative rounded whitespace-nowrap border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                >
                                                    Select All
                                                </a>

                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                >
                                                    Name
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                                                >
                                                    Email
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Role
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >
                                                    Actions
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                                >

                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {data.slice(startIndex, endIndex).map((person, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleRowClick(index)}
                                                    className={selectedRows.includes(index) ? "bg-gray-300" : "even:bg-gray-50"}

                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <a
                                                            id="disable"
                                                            aria-describedby="disable-description"
                                                            name="disable"
                                                            type="button"
                                                            className="h-4 w-4 mt-4 ml-2  mb-6 relative rounded whitespace-nowrap border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        >
                                                            Select
                                                        </a>
                                                    </td>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                                                        <input
                                                            type="text"
                                                            name="authorityName"
                                                            id="authorityName"
                                                            ref={(input) => (nameInputRefs.current[index] = input)}
                                                            onChange={(e) => handleNameChange(index, e.target.value)}
                                                            value={person.name}
                                                            autoComplete="off"
                                                            className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <input
                                                            type="text"
                                                            name="authorityEmail"
                                                            id="authorityEmail"
                                                            ref={(input) => (emailInputRefs.current[index] = input)}
                                                            onChange={(e) => handleEmailChange(index, e.target.value)}
                                                            value={person.email}
                                                            autoComplete="off"
                                                            className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        />
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <input
                                                            type="text"
                                                            name="authorityName"
                                                            id="authorityName"
                                                            ref={(input) => (roleInputRefs.current[index] = input)}
                                                            onChange={(e) => handleRoleChange(index, e.target.value)}
                                                            value={person.role}
                                                            autoComplete="off"
                                                            className="appearance-none block w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                        />
                                                    </td>
                                                    {deleteRow && (
                                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-right text-sm font-medium">

                                                            <div
                                                                onClick={(e) => {
                                                                    deleteSelectedUsers(index);
                                                                }}
                                                                className="flex text-sm items-center cursor-pointer text-red-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>

                                                                <span

                                                                >Delete</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <Pagination
                                        totalItems={totalItems}
                                        itemsPerPage={10}
                                        startIndex={startIndex + 1}
                                        currentPage={currentPage}
                                        onChangePage={(item) => {
                                            const newStartIndex = (item - 1) * 10;
                                            const newEndIndex = Math.min(data.length, newStartIndex + 10);
                                            setStartIndex(newStartIndex);
                                            setEndIndex(newEndIndex);
                                            setCurrentPage(item);
                                        }}
                                        endIndex={endIndex}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
