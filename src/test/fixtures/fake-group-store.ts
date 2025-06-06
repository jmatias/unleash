import type {
    IGroupStore,
    IStoreGroup,
} from '../../lib/types/stores/group-store.js';
import type Group from '../../lib/types/group.js';
import type {
    ICreateGroupUserModel,
    IGroup,
    IGroupModel,
    IGroupProject,
    IGroupRole,
    IGroupUser,
} from '../../lib/types/group.js';
import type { IGroupWithProjectRoles } from '../../lib/types/stores/access-store.js';
/* eslint-disable @typescript-eslint/no-unused-vars */
export default class FakeGroupStore implements IGroupStore {
    count(): Promise<number> {
        return Promise.resolve(0);
    }

    data: IGroup[];

    async getAll(): Promise<IGroup[]> {
        return Promise.resolve(this.data);
    }

    async delete(id: number): Promise<void> {
        this.data = this.data.filter((item) => item.id !== id);
        return Promise.resolve();
    }

    deleteAll(): Promise<void> {
        return Promise.resolve(undefined);
    }

    destroy(): void {}

    async exists(key: number): Promise<boolean> {
        return this.data.some((u) => u.id === key);
    }

    async get(key: number): Promise<IGroup | undefined> {
        return this.data.find((u) => u.id === key);
    }

    create(group: IStoreGroup): Promise<IGroup> {
        throw new Error('Method not implemented.');
    }

    existsWithName(name: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    addUsersToGroup(
        id: number,
        users: ICreateGroupUserModel[],
        userName: string,
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getAllUsersByGroups(groupIds: number[]): Promise<IGroupUser[]> {
        throw new Error('Method not implemented.');
    }

    deleteUsersFromGroup(deletableUsers: IGroupUser[]): Promise<void> {
        throw new Error('Method not implemented.');
    }

    update(group: IGroupModel): Promise<IGroup> {
        throw new Error('Method not implemented.');
    }

    updateGroupUsers(
        groupId: number,
        newUsers: ICreateGroupUserModel[],
        deletableUsers: IGroupUser[],
        userName: string,
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getAllWithId(ids: number[]): Promise<IGroup[]> {
        throw new Error('Method not implemented.');
    }

    getProjectGroupRoles(projectId: string): Promise<IGroupRole[]> {
        throw new Error('Method not implemented.');
    }

    getProjectGroups(projectId: string): Promise<IGroupWithProjectRoles[]> {
        throw new Error('Method not implemented.');
    }

    getGroupProjects(groupIds: number[]): Promise<IGroupProject[]> {
        throw new Error('Method not implemented.');
    }

    getNewGroupsForExternalUser(
        userId: number,
        externalGroups: string[],
    ): Promise<IGroup[]> {
        throw new Error('Method not implemented.');
    }

    addUserToGroups(
        userId: number,
        groupIds: number[],
        createdBy?: string,
    ): Promise<void> {
        throw new Error('Method not implemented.');
    }

    getOldGroupsForExternalUser(
        userId: number,
        externalGroups: string[],
    ): Promise<IGroupUser[]> {
        throw new Error('Method not implemented.');
    }

    getGroupsForUser(userId: number): Promise<Group[]> {
        throw new Error('Method not implemented.');
    }

    hasProjectRole(groupId: number): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    deleteScimGroups(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
